import { createClient } from '@supabase/supabase-js';
import constants from '../constants';

export default createClient(constants.SUPABASE_URL, constants.SUPABASE_ANON_KEY);
