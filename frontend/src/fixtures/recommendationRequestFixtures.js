const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "student@ucsb.edu",
    professorEmail: "professor@ucsb.edu",
    explanation: "explanation",
    dateRequested: "2024-05-09T23:19:21.971Z",
    dateNeeded: "2024-05-09T23:19:21.971Z",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 2,
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "explanation1",
      dateRequested: "2025-05-09T23:19:21.971Z",
      dateNeeded: "2025-05-09T23:19:21.971Z",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "professor2@ucsb.edu",
      explanation: "explanation2",
      dateRequested: "2026-05-09T23:19:21.971Z",
      dateNeeded: "2026-05-09T23:19:21.971Z",
      done: false,
    },
    {
      id: 4,
      requesterEmail: "student3@ucsb.edu",
      professorEmail: "professor3@ucsb.edu",
      explanation: "explanation3",
      dateRequested: "2027-05-09T23:19:21.971Z",
      dateNeeded: "2027-05-09T23:19:21.971Z",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
