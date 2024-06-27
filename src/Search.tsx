


// import React, { useState } from 'react';
// import { Box, Button, MenuItem, Select, Typography } from '@mui/material';

// interface SearchProps {
//   onSearchResults: (results: any[], mode: 'latest' | 'all') => void;
// }

// const Search: React.FC<SearchProps> = ({ onSearchResults }) => {
//   const [latestOrAll, setLatestOrAll] = useState<'latest' | 'all'>('latest');

//   const handleSearch = async () => {
//     const apiUrl = latestOrAll === 'latest' ? '/api/results' : '/api/allResults';

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}${apiUrl}`);
//       const data = await response.json();
//       onSearchResults(data, latestOrAll);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/results/${id}`, {
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         handleSearch(); // Re-fetch the data after deletion
//       } else {
//         console.error('Failed to delete the record');
//       }
//     } catch (error) {
//       console.error('Error deleting record:', error);
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Search Detection Results
//       </Typography>
//       <Select
//         value={latestOrAll}
//         onChange={(e) => setLatestOrAll(e.target.value as 'latest' | 'all')}
//         sx={{ marginRight: '10px' }}
//       >
//         <MenuItem value="latest">Latest</MenuItem>
//         <MenuItem value="all">All</MenuItem>
//       </Select>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSearch}
//       >
//         Search
//       </Button>
//     </Box>
//   );
// };

// export default Search;

















import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';

interface SearchProps {
  onSearchResults: (results: any[], mode: 'latest' | 'all') => void;
}

const Search: React.FC<SearchProps> = ({ onSearchResults }) => {
  const [latestOrAll, setLatestOrAll] = useState<'latest' | 'all'>('all');

  const handleSearch = async () => {
    const apiUrl = latestOrAll === 'latest' ? '/api/results' : '/api/allResults';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${apiUrl}`);
      const data = await response.json();
      onSearchResults(data, latestOrAll);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Search Detection Results
      </Typography>
      <Select
        value={latestOrAll}
        onChange={(e) => setLatestOrAll(e.target.value as 'latest' | 'all')}
        sx={{ marginRight: '10px' }}
      >
        <MenuItem value="latest">Latest</MenuItem>
        <MenuItem value="all">All</MenuItem>
      </Select>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
      >
        Search
      </Button>
    </Box>
  );
};

export default Search;
