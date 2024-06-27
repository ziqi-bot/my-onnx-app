




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
//       onSearchResults(data.results || [], latestOrAll);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
        
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
  const [latestOrAll, setLatestOrAll] = useState<'latest' | 'all'>('latest');

  const handleSearch = async () => {
    const apiUrl = latestOrAll === 'latest' ? '/api/results' : '/api/allResults';
  
    try {
      // Remove any double slashes except for the http(s) part
      const fullUrl = `${process.env.REACT_APP_API_URL}${apiUrl}`.replace(/([^:]\/)\/+/g, "$1");
      const response = await fetch(fullUrl);
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
