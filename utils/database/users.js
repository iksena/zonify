export const saveUser = (supabase, profile) => {
  const {
    country, display_name, email, id, product,
  } = profile;
  console.log('profile', profile);

  return supabase.from('users').upsert({
    id,
    name: display_name,
    subscription: product,
    online: true,
    country,
    email,
    modified_at: new Date().toISOString(),
  });
};

const users = {
  saveUser,
};

export default users;
