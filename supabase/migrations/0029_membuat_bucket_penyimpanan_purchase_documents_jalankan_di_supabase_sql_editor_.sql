-- Insert bucket if not exists
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('purchase_documents', 'purchase_documents', false)
    ON CONFLICT (id) DO NOTHING;