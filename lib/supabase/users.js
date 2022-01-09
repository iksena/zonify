export const saveUser = (supabase) => (profile, { expiresIn }) => {
  const {
    country, display_name, email, id, product,
  } = profile;

  return supabase.from('users').upsert({
    id,
    name: display_name,
    subscription: product,
    online: true,
    country,
    email,
    modified_at: new Date().toISOString(),
    expired_at: expiresIn,
  });
};

export const findOneUser = (supabase) => (id) => supabase
  .from('users')
  .select('*')
  .eq('id', id)
  .limit(1)
  .single();

const users = {
  saveUser,
  findOneUser,
};

export default users;
