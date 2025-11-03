import { useEffect, useState } from 'react';
import axiosInstance, { BACKEND_URL } from '../api/axiosInstance';
import { handleError } from "../utils/alertUtils";

function Badges({ userId }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchBadges = async () => {
      setLoading(true);
      try {
        await axiosInstance.post('/badges/award/all');
        const res = await axiosInstance.get(`/badges/${userId}`);
        setBadges(res.data);
      } catch (err) {
        console.error(err);
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  if (loading) return <p className="text-center py-4">Loading badges...</p>;
  if (badges.length === 0) return <p className="text-center py-4">No badges yet.</p>;

  return (
    <div className="badges-container flex flex-wrap gap-8 justify-center p-4">
      {badges.map(badge => {
        const imageUrl = badge.image_url 
          ? `${BACKEND_URL}${badge.image_url}` 
          : '/default-badge.png';
        
        return (
          <div key={badge.id} className="text-center">
            <img
              src={imageUrl}
              alt={badge.name}
              className="w-20 h-20 mx-auto mb-2 object-cover rounded-full shadow-lg"
              onError={(e) => {
                console.error('Failed to load badge image:', imageUrl);
                e.currentTarget.src = '/default-badge.png';
              }}
            />
            <h4 className="font-semibold text-gray-800">{badge.name}</h4>
            <p className="text-xs text-gray-600 mb-1">{badge.description}</p>
            <small className="text-gray-500 block">
              {badge.awarded_at
                ? new Date(badge.awarded_at).toLocaleDateString()
                : 'Not awarded yet'}
            </small>
          </div>
        );
      })}
    </div>
  );
}

export default Badges;