export const subscribeTrackInserts = (supabase) => (roomId, callback) => supabase
  .from(`track_inserts:room_id=eq.${roomId}`)
  .on('INSERT', callback)
  .subscribe();

export const addTrackToRoom = (supabase) => (roomId, trackUri, userId) => supabase
  .from('track_inserts')
  .insert({
    room_id: roomId,
    track_uri: trackUri,
    user_id: userId,
  });

const trackInserts = {
  subscribeTrackInserts,
  addTrackToRoom,
};

export default trackInserts;
