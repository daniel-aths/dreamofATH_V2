import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('client_reviews') //from my table name
    .select('*') //from all columns
    .eq('status', 'approved') //if status equals aprroved
    .order('rating', { ascending: false })
    .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch'})
    }

    res.status(200).json(data);
}