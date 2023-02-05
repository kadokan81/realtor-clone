import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function LeafletMap({ longitude, latitude, address }) {
	return (
		<div style={{ height: '100%', width: '100%' }}>
			<MapContainer
				style={{ height: '100%', width: '100%' }}
				center={[longitude, latitude]}
				zoom={15}
				scrollWheelZoom={false}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				<Marker position={[longitude, latitude]}>
					<Popup>{address}</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
