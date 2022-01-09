export const saveRoom = (supabase) => (room) => {
  const { name, userId, id } = room;

  return supabase.from('rooms').upsert({
    id,
    name,
    owner_id: userId,
    modified_at: new Date().toISOString(),
  });
};

const rooms = {
  saveRoom,
};

export default rooms;
