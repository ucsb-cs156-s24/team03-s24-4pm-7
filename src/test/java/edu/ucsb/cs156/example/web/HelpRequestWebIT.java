package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_helprequest() throws Exception {
        setupUser(true);

        page.getByText("HelpRequests").click();

        page.getByText("Create HelpRequest").click();
        assertThat(page.getByText("Create New HelpRequest")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("test@gmail.com");
        page.getByTestId("HelpRequestForm-teamId").fill("team07");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("table");
        page.getByTestId("HelpRequestForm-requestTime").fill("2020-01-01T00:00");
        page.getByTestId("HelpRequestForm-explanation").fill("explanation");
        page.getByTestId("HelpRequestForm-solved").fill("false");

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("test@gmail.com");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId"))
                .hasText("team07");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-tableOrBreakoutRoom"))
                .hasText("table");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requestTime"))
                .hasText("2020-01-01T00:00:00");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
                .hasText("explanation");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved"))
                .hasText("false");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit HelpRequest")).isVisible();
        page.getByTestId("HelpRequestForm-requesterEmail").fill("test@gmail.com_edit");
        page.getByTestId("HelpRequestForm-teamId").fill("team07_edit");
        page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("table");
        page.getByTestId("HelpRequestForm-requestTime").fill("1950-01-01T00:00");
        page.getByTestId("HelpRequestForm-explanation").fill("explanation_edit");
        page.getByTestId("HelpRequestForm-solved").fill("true");
        page.getByTestId("HelpRequestForm-submit").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("test@gmail.com_edit");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId"))
                .hasText("team07_edit");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-tableOrBreakoutRoom"))
                .hasText("table");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requestTime"))
                .hasText("1950-01-01T00:00:00");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
                .hasText("explanation_edit");
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved"))
                .hasText("true");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_helprequest() throws Exception {
        setupUser(false);

        page.getByText("HelpRequests").click();

        assertThat(page.getByText("Create HelpRequest")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }
}