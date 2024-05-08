const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "email1@gmail.com",
        "teamId": "01",
        "tableOrBreakoutRoom": "table",
        "requestTime": "2022-01-02T12:00:00",
        "explanation": "sample explanation for team01",
        "solved": true
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requesterEmail": "email1@gmail.com",
            "teamId": "01",
            "tableOrBreakoutRoom": "table",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "sample explanation for team01",
            "solved": true
        },
        {
            "id": 2,
            "requesterEmail": "email2@ucsb.edu",
            "teamId": "02",
            "tableOrBreakoutRoom": "table",
            "requestTime": "2022-04-03T12:00:00",
            "explanation": "sample explanation for team02",
            "solved": false
        },
        {
            "id": 3,
            "requesterEmail": "email3@hotmail.com",
            "teamId": "03",
            "tableOrBreakoutRoom": "breakoutRoom",
            "requestTime": "2022-07-04T12:00:00",
            "explanation": "sample explanation for breakoutRoom03",
            "solved": false
        }
    ]
};


export { helpRequestFixtures };