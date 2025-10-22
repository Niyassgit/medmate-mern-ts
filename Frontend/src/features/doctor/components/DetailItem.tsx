// Helper component for detail items
export const DetailItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
    <span className="text-xl">{icon}</span>
    <div className="flex-1">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  </div>
);