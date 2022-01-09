import { createClient } from '@supabase/supabase-js';

import constants from '../../constants';
import users from './users';
import rooms from './rooms';
import trackInserts from './trackInserts';

const supabase = createClient(constants.SUPABASE_URL, constants.SUPABASE_ANON_KEY);

const functions = Object
  .entries({
    ...users,
    ...rooms,
    ...trackInserts,
  })
  .reduce((executors, [key, fn]) => ({
    ...executors,
    [key]: fn?.(supabase),
  }), {});

export default functions;
