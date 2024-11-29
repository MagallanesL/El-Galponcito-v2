import React, { useEffect, useState } from 'react';
import DashboardAdmin from '../dashboard/DashboardAdmin';
import Maps from './maps/maps'
import { db } from '../../../firebase/firebaseconfig';  
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';  
import Swal from 'sweetalert2'; 


const CoverageZone = () => {
  const pois = [
    { key: 'Villa Mercedes', location: { lat: -33.6744, lng: -65.4578 } }
  ];
  return (
    <>
      <DashboardAdmin />
      <Maps pois={pois} />
      <div>

      </div>
    </>
  );
};

export default CoverageZone;
