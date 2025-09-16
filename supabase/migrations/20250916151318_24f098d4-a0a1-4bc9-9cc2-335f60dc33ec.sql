-- Create tables for educational resources and AI-generated questions

-- Table for educational levels
CREATE TABLE public.education_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for math topics/themes
CREATE TABLE public.math_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  education_level_id UUID REFERENCES public.education_levels(id),
  parent_topic_id UUID REFERENCES public.math_topics(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for educational resources (eduscol, programs, evaluations)
CREATE TABLE public.educational_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT NOT NULL, -- 'eduscol', 'programme', 'evaluation_nationale', etc.
  education_level_id UUID REFERENCES public.education_levels(id),
  topic_id UUID REFERENCES public.math_topics(id),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  compilation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_current BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for AI-generated questions
CREATE TABLE public.generated_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'multiple_choice', 'open_ended', 'calculation', etc.
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
  education_level_id UUID REFERENCES public.education_levels(id),
  topic_id UUID REFERENCES public.math_topics(id),
  correct_answer TEXT,
  possible_answers JSONB, -- For multiple choice questions
  explanation TEXT,
  source_resources UUID[] DEFAULT '{}', -- Array of resource IDs used to generate this question
  generated_by TEXT DEFAULT 'ai_agent', -- Track which agent generated it
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  usage_count INTEGER DEFAULT 0,
  user_feedback JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for resource compilation logs
CREATE TABLE public.resource_compilation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  compilation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resources_found INTEGER DEFAULT 0,
  resources_processed INTEGER DEFAULT 0,
  new_resources INTEGER DEFAULT 0,
  updated_resources INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  error_message TEXT,
  processing_time_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.education_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.math_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_compilation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (read access for authenticated users, admin write access)
CREATE POLICY "Anyone can read education levels" ON public.education_levels FOR SELECT USING (true);
CREATE POLICY "Anyone can read math topics" ON public.math_topics FOR SELECT USING (true);
CREATE POLICY "Anyone can read educational resources" ON public.educational_resources FOR SELECT USING (true);
CREATE POLICY "Anyone can read generated questions" ON public.generated_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can read compilation logs" ON public.resource_compilation_logs FOR SELECT USING (true);

-- Insert initial education levels
INSERT INTO public.education_levels (name, description, order_index) VALUES
('CP', 'Cours Préparatoire', 1),
('CE1', 'Cours Élémentaire 1ère année', 2),
('CE2', 'Cours Élémentaire 2ème année', 3),
('CM1', 'Cours Moyen 1ère année', 4),
('CM2', 'Cours Moyen 2ème année', 5),
('6ème', 'Sixième', 6),
('5ème', 'Cinquième', 7),
('4ème', 'Quatrième', 8),
('3ème', 'Troisième', 9),
('Seconde', 'Seconde générale et technologique', 10),
('Première', 'Première générale', 11),
('Terminale', 'Terminale générale', 12);

-- Insert initial math topics
INSERT INTO public.math_topics (name, description, education_level_id) 
SELECT 'Nombres et calculs', 'Opérations, fractions, décimaux', id FROM public.education_levels WHERE name IN ('CP', 'CE1', 'CE2', 'CM1', 'CM2');

INSERT INTO public.math_topics (name, description, education_level_id) 
SELECT 'Géométrie', 'Figures, mesures, espace', id FROM public.education_levels WHERE name IN ('CP', 'CE1', 'CE2', 'CM1', 'CM2');

INSERT INTO public.math_topics (name, description, education_level_id) 
SELECT 'Grandeurs et mesures', 'Longueurs, masses, durées', id FROM public.education_levels WHERE name IN ('CP', 'CE1', 'CE2', 'CM1', 'CM2');

INSERT INTO public.math_topics (name, description, education_level_id) 
SELECT 'Algèbre', 'Équations, fonctions, expressions', id FROM public.education_levels WHERE name IN ('6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale');

INSERT INTO public.math_topics (name, description, education_level_id) 
SELECT 'Fonctions', 'Fonctions linéaires, affines, polynomiales', id FROM public.education_levels WHERE name IN ('Seconde', 'Première', 'Terminale');

INSERT INTO public.math_topics (name, description, education_level_id) 
SELECT 'Probabilités et statistiques', 'Analyse de données, probabilités', id FROM public.education_levels WHERE name IN ('4ème', '3ème', 'Seconde', 'Première', 'Terminale');

-- Create indexes for better performance
CREATE INDEX idx_educational_resources_level ON public.educational_resources(education_level_id);
CREATE INDEX idx_educational_resources_topic ON public.educational_resources(topic_id);
CREATE INDEX idx_educational_resources_current ON public.educational_resources(is_current);
CREATE INDEX idx_generated_questions_level ON public.generated_questions(education_level_id);
CREATE INDEX idx_generated_questions_topic ON public.generated_questions(topic_id);
CREATE INDEX idx_generated_questions_active ON public.generated_questions(is_active);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_education_levels_updated_at
    BEFORE UPDATE ON public.education_levels
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_math_topics_updated_at
    BEFORE UPDATE ON public.math_topics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();