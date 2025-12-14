import { useEffect, useState } from "react";
import { fetchEras, type Era } from "../../api/eras";

interface EraSelectorProps {
  onSelectEra: (eraId: string) => void;
}

export function EraSelector({ onSelectEra }: EraSelectorProps) {
  const [eras, setEras] = useState<Era[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEras().then((data) => {
      setEras(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading eras...</p>;

  return (
    <div className="flex gap-6 justify-center">
      {eras.map((era) => (
        <button
          key={era.id}
          onClick={() => onSelectEra(era.id)}
          className="flex flex-col items-center"
        >
          <img
            src={era.image.startsWith("http") ? era.image : `/assets/images/${era.image}`}
            alt={era.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <span className="text-white mt-2">{era.name}</span>
        </button>
      ))}
    </div>
  );
}
