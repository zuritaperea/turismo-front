import Tags from "./Tags";

const Servicios = ({ services }) => (
    <>
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        Servicios
      </div>
      <Tags elementos={services} />
    </>
  );

  export default Servicios;
  