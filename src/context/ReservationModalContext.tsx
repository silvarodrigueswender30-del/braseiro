import React, { createContext, useContext, useState, useCallback } from 'react';

interface ReservationModalContextValue {
  isOpen: boolean;
  initialOcasiao?: string;
  openReservationModal: (opts?: { ocasiao?: string }) => void;
  closeReservationModal: () => void;
}

const ReservationModalContext = createContext<ReservationModalContextValue>({
  isOpen: false,
  openReservationModal: () => {},
  closeReservationModal: () => {},
});

export const ReservationModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialOcasiao, setInitialOcasiao] = useState<string | undefined>(undefined);

  const openReservationModal = useCallback((opts?: { ocasiao?: string }) => {
    setInitialOcasiao(opts?.ocasiao);
    setIsOpen(true);
  }, []);

  const closeReservationModal = useCallback(() => {
    setIsOpen(false);
    setInitialOcasiao(undefined);
  }, []);

  return (
    <ReservationModalContext.Provider
      value={{
        isOpen,
        initialOcasiao,
        openReservationModal,
        closeReservationModal,
      }}
    >
      {children}
    </ReservationModalContext.Provider>
  );
};

export const useReservationModal = () => useContext(ReservationModalContext);
