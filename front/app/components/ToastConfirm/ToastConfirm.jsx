import { toast } from "react-toastify";
import "./ToastConfirm.css"

export const ToastConfirm = ({ message, onConfirm }) => {
  const show = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-xl">{message}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                onConfirm(true);
                closeToast();
              }}
              className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 text-lg"
            >
              Sí
            </button>
            <button
              onClick={() => {
                onConfirm(false);
                closeToast();
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 text-lg"
            >
              No
            </button>
          </div>
        </div>
      ),
      { 
        autoClose: true, 
        closeOnClick: true, 
        position: 'bottom-center',
        style: {
          fontSize: '18px',
          padding: '20px',
          minWidth: '450px',
        },
      }
    );
  };

  return { show };
};
