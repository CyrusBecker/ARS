import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import MainLayout from "./common/MainLayout";

const Dashboard: React.FC = () => {
  const dashboardGroups = [
    {
      section: "Schedules and Faculty",
      cards: [
        { title: "Schedule Overview", path: "/scheduleOverview" },
        { title: "Faculty", path: "/facultyOverview" },
      ],
    },
    {
      section: "Curriculum",
      cards: [{ title: "Curriculum Management", path: "/curriculumOverview" }],
    },
    {
      section: "Room Management",
      cards: [{ title: "Room Availability", path: "#" }],
    },
    {
      section: "Archive",
      cards: [
        { title: "Schedule Archive", path: "#" },
        { title: "Faculty Archive", path: "#" },
        { title: "Curriculum Archive", path: "#" },
      ],
    },
  ];

  return (
    <MainLayout>
      <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to the ARM System. Access all your modules from here.
          </Typography>
        </Paper>

        {dashboardGroups.map((group, i) => (
          <Paper
            key={i}
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={500}
              gutterBottom
              sx={{ p: 1 }}
            >
              {group.section}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {group.cards.map((card, j) => (
                <Box
                  key={j}
                  component="a"
                  href={card.path}
                  sx={{
                    textDecoration: "none",
                    flexBasis: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                      md: "calc(33.33% - 10.67px)",
                      lg: "calc(25% - 12px)",
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: 120,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 2,
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography align="center" fontWeight={600} variant="h6">
                        {card.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
