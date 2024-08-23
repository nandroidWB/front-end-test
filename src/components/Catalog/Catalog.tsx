import React, { useEffect, useState } from 'react';

const Catalog: React.FC = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Simulación de llamada a API para obtener propiedades
    const fetchProperties = async () => {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <h1>Catálogo de Propiedades</h1>
      <ul>
        {properties.map((property: any) => (
          <li key={property.id}>
            <h2>{property.name}</h2>
            <p>{property.description}</p>
            <p>Precio: {property.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;
