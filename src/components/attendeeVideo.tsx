export function AttendeeVideo({ name, id }: { name: string; id: string }) {
  return (
    <div>
      <div className="w-60 h-96 bg-slate-500 rounded-lg">
        <video className="object-cover w-60 h-96 rounded-lg" id={"vid-" + id} />
        <div className="p-2 text-white relative -top-8">{name}</div>
      </div>
    </div>
  );
}
