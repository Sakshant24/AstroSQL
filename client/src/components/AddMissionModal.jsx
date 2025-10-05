import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function AddMissionModal({ isOpen, closeModal, onMissionAdded }) {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [launchDate, setLaunchDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missionData = {
      name: name,
      destination_planet: destination,
      launch_date: launchDate,
      mission_status: 'Planned', 
      mission_type: 'Unknown',
      objective: 'New mission objective to be defined.'
    };

    try {
      const response = await fetch('http://localhost:3001/api/v1/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missionData),
      });
      if (response.ok) {
        onMissionAdded();
        closeModal();
      } else {
        console.error("Failed to create mission");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-cyan-400">Add New Mission</Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Mission Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2" />
                  </div>
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-300">Destination</label>
                    <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2" />
                  </div>
                  <div>
                    <label htmlFor="launchDate" className="block text-sm font-medium text-gray-300">Launch Date</label>
                    <input type="date" id="launchDate" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2" />
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={closeModal} className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none">Cancel</button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 focus:outline-none">Create</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}