import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { DataTableStateEvent } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FaChevronDown } from 'react-icons/fa';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscription: string;
    date_start: number;
    date_end: number;
}

const App: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rowCount, setRowCount] = useState('');
    const op = useRef<OverlayPanel>(null);
    const arrowRef = useRef(null);
    const Rows = 10;
    
// Function to fetch data from the API
    const fetchData = (page: number, rows: number) => {
        fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}&limit=${rows}`)
            .then(response => response.json())
            .then(data => {
                setArtworks(data.data);
                setTotalRecords(data.pagination.total);
            })
            .catch(error => console.error('Internal server error:', error));
    };

// Fetch initial data when the component mounts
    useEffect(() => {
        fetchData(0, Rows);
    }, []);

// Function to handle pagination and row count changes
    const onPage = ({ first = 0, page = 0, rows = 10 }: DataTableStateEvent) => {
        setFirst(first);
        fetchData(page, rows);
    };

// Function to handle the submission of the row count
    const onSubmit = () => {
        const count = Number(rowCount);
        if (count > 0) {
            setSelectedArtworks(artworks.slice(0, count));
        }
        op.current?.hide();
    };

    // Function to render the header checkbox with a chevron down icon
    const headerCheckboxWithChevronDown = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>

                <Button
                    icon={<FaChevronDown />}
                    className="p-button-text p-button-sm"
                    onClick={(e) => op.current?.toggle(e)}
                    ref={arrowRef}
                />
            </div>
        );
    };


    return (
        <>
            <OverlayPanel ref={op}>
                <div style={{ padding: '0.5rem', width: '150px', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                    <InputText
                        placeholder="Enter row count"
                        value={rowCount}
                        onChange={(e) => setRowCount(e.target.value)}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <Button label="Submit" onClick={onSubmit} />
                </div>
            </OverlayPanel>

            <DataTable
                value={artworks}
                paginator
                rows={10}
                first={first}
                totalRecords={totalRecords}
                lazy
                dataKey="id"
                selection={selectedArtworks}
                onSelectionChange={(e) => setSelectedArtworks(e.value)}
                selectionMode="multiple"
                onPage={onPage}
            >
                <Column
                    selectionMode="multiple"
                    header={headerCheckboxWithChevronDown}
                    style={{ width: '4em' }}
                />
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscription" header="Inscription" />
                <Column field="date_start" header="Date Start" />
                <Column field="date_end" header="Date End" />
            </DataTable>
        </>
    );
};

export default App;
