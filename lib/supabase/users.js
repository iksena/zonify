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

const users = {
  saveUser,
};

export default users;
