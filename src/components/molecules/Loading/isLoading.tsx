
import { FiLoader } from "react-icons/fi"; // Importa un ícono de carga

export const IsLoading = () => {
    return (
        <div className="container relative mt-24 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 flex flex-col items-center space-y-4 text-center">
                {/* Ícono de carga animado */}
                <FiLoader className="h-10 w-10 text-blue-500 animate-spin" />
                <h1 className="text-2xl font-semibold tracking-tight text-gray-700">
                    Cargando, por favor espera...
                </h1>
                <p className="text-sm text-gray-500">
                    Estamos preparando todo para ti. Esto no tomará mucho tiempo.
                </p>
            </div>
        </div>
    );
};
