import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Professor Email/);
    await screen.findByText(/Explanation/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestFixtures.oneRecommendationRequest}
        />
      </Router>
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail"
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail"
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation"
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested"
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded"
    );
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.change(professorEmailField, { target: { value: "bad-input" } });
    fireEvent.change(explanationField, { target: { value: "bad-input" } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-input" } });
    fireEvent.change(dateNeededField, { target: { value: "bad-input" } });
    fireEvent.change(doneField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(
      /RequesterEmail must be in the format EMAIL, e.g. cgaucho@ucsb.edu/
    );
    expect(
      screen.getByText(
        /RequesterEmail must be in the format EMAIL, e.g. cgaucho@ucsb.edu/
      )
    ).toBeInTheDocument();

    await screen.findByText(
      /ProfessorEmail must be in the format EMAIL, e.g. cgaucho@ucsb.edu/
    );
    expect(
      screen.getByText(
        /ProfessorEmail must be in the format EMAIL, e.g. cgaucho@ucsb.edu/
      )
    ).toBeInTheDocument();

    await screen.findByText(/Done must be true or false./);
    expect(screen.getByText(/Done must be true or false./)).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/RequesterEmail is required./);
    expect(screen.getByText(/ProfessorEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/DateRequested is required./)).toBeInTheDocument();
    expect(screen.getByText(/DateNeeded is required./)).toBeInTheDocument();
    expect(screen.getByText(/Done is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail"
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail"
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation"
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested"
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded"
    );
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "cgaucho@ucsb.edu" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "pgaucho@ucsb.edu" },
    });
    fireEvent.change(explanationField, {
      target: { value: "I need a recommendation" },
    });

    fireEvent.change(dateRequestedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(doneField, {
      target: { value: "true" },
    });
    fireEvent.click(submitButton);
    expect(
      screen.queryByText(
        /RequesterEmail must be in the format EMAIL, e.g. cgaucho@ucsb.edu/
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /ProfessorEmail must be in the format EMAIL, e.g. cgaucho@ucsb.edu/
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/DateRequested must be in ISO format/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/DateNeeded must be in ISO format/)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Done must be true or false./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>
    );
    await screen.findByTestId("RecommendationRequestForm-cancel");
    const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
