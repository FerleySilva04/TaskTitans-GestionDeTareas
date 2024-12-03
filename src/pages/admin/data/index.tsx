import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import { BarData } from "@/components/molecules/BarData/barData";
import { DonutData } from "@/components/molecules/DonutData/donutData";

const Chart = () => {
  const user = useMiddleware(Role.ADMIN);

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className="flex flex-wrap gap-6 justify-center items-center p-4">
        {/* Componente de Barra */}
        <div className="w-full md:w-1/2 lg:w-2/5">
          <BarData />
        </div>
        
        {/* Componente de Dona */}
        <div className="w-full md:w-1/2 lg:w-2/5">
          <DonutData />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Chart;
