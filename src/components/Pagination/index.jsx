import { Box, Button, Icon, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const Pagination = ({ lastPage, currentPage, setCurrentPage }) => {
    const [localPage, setLocalPage] = useState(currentPage);

    useEffect(() => {
        // Atualiza a página local quando a prop currentPage mudar.
        setLocalPage(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page !== localPage) {
            setLocalPage(page);
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        const buttons = [];
        const startPage = Math.max(2, localPage - 2);
        const endPage = Math.min(lastPage - 1, localPage + 2);

        // Primeiro botão (Página 1)
        buttons.push(
            <Button
                ml="6px"
                color={localPage === 1 ? 'white' : 'black'}
                backgroundColor={localPage === 1 ? 'blue.500' : 'gray.200'}
                onClick={() => handlePageChange(1)}
                key={1}
            >
                1
            </Button>
        );

        // Adiciona elipses (...) se necessário
        if (startPage > 2) {
            buttons.push(<Text ml="6px" key="ellipsis-start">...</Text>);
        }

        // Botões de página intermediária
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    ml="6px"
                    color={localPage === i ? 'white' : 'black'}
                    backgroundColor={localPage === i ? 'blue.500' : 'gray.200'}
                    onClick={() => handlePageChange(i)}
                    key={i}
                >
                    {i}
                </Button>
            );
        }

        // Adiciona elipses (...) se necessário
        if (endPage < lastPage - 1) {
            buttons.push(<Text ml="6px" key="ellipsis-end">...</Text>);
        }

        // Último botão (Última página)
        if (lastPage > 1) {
            buttons.push(
                <Button
                    ml="6px"
                    color={localPage === lastPage ? 'white' : 'black'}
                    backgroundColor={localPage === lastPage ? 'blue.500' : 'gray.200'}
                    onClick={() => handlePageChange(lastPage)}
                    key={lastPage}
                >
                    {lastPage}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Box maxW={800} py={5} px={2} mb={24} display="flex" justifyContent="center">
            <Button
                ml="6px"
                onClick={() => handlePageChange(Math.max(1, localPage - 1))}
                isDisabled={localPage === 1}
            >
                <Icon as={SkipPreviousIcon} />
            </Button>

            {renderPagination()}

            <Button
                ml="6px"
                onClick={() => handlePageChange(Math.min(lastPage, localPage + 1))}
                isDisabled={localPage === lastPage}
            >
                <Icon as={SkipNextIcon} />
            </Button>
        </Box>
    );
};

export default Pagination;
