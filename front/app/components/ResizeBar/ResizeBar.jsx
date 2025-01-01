import { useEffect } from 'react';
import {FaArrowLeft, FaArrowsAltH, FaArrowsAltV} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

export const ResizeBar = ({typeBar, max, minpx, maxpx, setChatHeight, setChatWidth, chatRef}) => {
  const startResizingWidth = (e) => {
    window.addEventListener('mousemove', handleResizeWidth);
    window.addEventListener('mouseup', stopResizing);
  };

  const startResizingHeight = (e) => {
    window.addEventListener('mousemove', handleResizeHeight);
    window.addEventListener('mouseup', stopResizing);
  };

  const stopResizing = () => {
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', handleResizeWidth);
    window.removeEventListener('mousemove', handleResizeHeight);
    window.removeEventListener('mouseup', stopResizing);
  };

  const handleResizeWidth = (e) => {
    const newWidth = Math.abs(chatRef.current.getBoundingClientRect().right - e.clientX);
    const maxWidth = window.innerWidth * max;
    if (newWidth > minpx && newWidth < Math.min(maxpx, maxWidth)) {
      setChatWidth(newWidth);
    }
  };

  const handleResizeHeight = (e) => {
    const newHeight = Math.abs(chatRef.current.getBoundingClientRect().bottom - e.clientY);
    const maxHeight = window.innerHeight * max;
    if (newHeight > minpx && newHeight < maxHeight) {
      setChatHeight(newHeight);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleResizeWidth);
      window.removeEventListener('mousemove', handleResizeHeight);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
  
  if (typeBar == "width") 
    return (
      <div
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize rounded p-1 bg-slate-600"
        onMouseDown={startResizingWidth}
        data-tooltip-content="Ajustar ancho"
        data-tooltip-id="resize-width-tooltip"
      >
        {/* <FaArrowsAltH className='text-sm text-gray-400' /> */}
        <Tooltip id="resize-width-tooltip" place="left" />
      </div>
    );

  return (
    <div
      className="absolute top-0 left-0 w-full h-2 cursor-ns-resize rounded p-1 bg-slate-600"
      onMouseDown={startResizingHeight}
      data-tooltip-content="Ajustar alto"
      data-tooltip-id="resize-height-tooltip"
    >
      {/* <FaArrowsAltV className='text-sm text-gray-400' /> */}
      <Tooltip id="resize-height-tooltip" place="top" />
    </div>
  );
};
