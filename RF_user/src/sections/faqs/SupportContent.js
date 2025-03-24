import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Accordion, Typography, AccordionSummary, AccordionDetails } from '@mui/material';

// ----------------------------------------------------------------------

export default function SupportContent({ contents }) {
  const [expanded, setExpanded] = useState(false);
  const handleChangeExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      {contents &&
        contents.length > 0 &&
        contents.map((category, index) => (
          <div key={index}>
            <Typography sx={{ fontSize: { md: '24px', xs: '20px' }, fontWeight: '700' }} mt={3}>
              {category.categoryTitle}
            </Typography>
            {category.qaData &&
              category.qaData.length > 0 &&
              category.qaData.map((question) => (
                <Accordion
                  key={question.id}
                  expanded={expanded === question.question}
                  onChange={handleChangeExpanded(question.question)}
                >
                  <AccordionSummary
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        my: 4,
                        ...(expanded === question.question && {
                          mb: 2.5,
                        }),
                      },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {question.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm:
                          question.images && question.images.length > 0
                            ? 'repeat(2, 1fr)'
                            : 'repeat(1, 1fr)',
                      }}
                      gap={1}
                    >
                      <Typography
                        sx={{ color: 'text.secondary' }}
                        dangerouslySetInnerHTML={{ __html: question.answer }}
                      />
                      {question.images && question.images.length > 0 && (
                        <img alt="answer" src={question.images[0].preview} />
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
          </div>
        ))}
    </Box>
  );
}

SupportContent.propTypes = {
  contents: PropTypes.array,
};
