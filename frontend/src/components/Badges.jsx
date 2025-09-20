import { useEffect, useState } from 'react';
import axios from 'axios';

function Badges({ userId }) {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // 1️⃣ Award eligible badges automatically
    axios.post('/badges/award/all')  
      .then(res => console.log('Badges checked:', res.data))
      .catch(err => console.error('Error awarding badges:', err));

    // 2️⃣ Fetch badges for the user
    axios.get(`/badges/${userId}`)
      .then(res => setBadges(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  if (badges.length === 0) return <p>No badges yet.</p>;

  return (
    <div className="badges-container flex flex-wrap gap-4">
      {badges.map(badge => (
        <div key={badge.id} className="badge-card border p-3 rounded-lg shadow-sm">
          <img src={badge.image_url} alt={badge.name} className="w-16 h-16 mb-2" />
          <h4 className="font-semibold">{badge.name}</h4>
          <p className="text-sm text-gray-600">{badge.description}</p>
          <small className="text-gray-500">
            Awarded: {new Date(badge.awarded_at).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default Badges;
