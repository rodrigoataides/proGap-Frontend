import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sistema from '../../pages/Sistema';

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sistema />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
