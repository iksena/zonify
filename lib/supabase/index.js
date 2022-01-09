import { createClient } from '@supabase/supabase-js';

import constants from '../constants';
import users from './users';
import rooms from './rooms';
import trackInserts from './trackInserts';

export const client = createClient(constants.SUPABASE_URL, constants.SUPABASE_ANON_KEY);

const functions = Object
  .entries({
    ...users,
    ...rooms,
    ...trackInserts,
  })
  .reduce((executors, [key, fn]) => ({
    ...executors,
    [key]: fn?.(client),
  }), {});

export default functions;
