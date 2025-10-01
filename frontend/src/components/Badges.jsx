import { useEffect, useState } from 'react';
import axios from 'axios';

function Badges({ userId }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchBadges = async () => {
      setLoading(true);
      try {
        await axios.post('/badges/award/all');
        const res = await axios.get(`/badges/${userId}`);
        setBadges(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  if (loading) return <p>Loading badges...</p>;
  if (badges.length === 0) return <p>No badges yet.</p>;

  return (
    <div className="badges-container flex flex-wrap gap-8 justify-center">
      {badges.map(badge => (
        <div key={badge.id} className="text-center">
          <img
            src={badge.image_url || '/default-badge.png'}
            alt={badge.name}
            className="w-20 h-20 mx-auto mb-2 object-cover"
            onError={(e) => (e.currentTarget.src = '/default-badge.png')}
          />
          <h4 className="font-semibold">{badge.name}</h4>
          <small className="text-gray-500 block">
            {badge.awarded_at
              ? new Date(badge.awarded_at).toLocaleDateString()
              : 'Not awarded yet'}
          </small>
        </div>
      ))}
    </div>
  );
}

export default Badges;
