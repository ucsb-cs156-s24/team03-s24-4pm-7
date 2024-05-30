package edu.ucsb.cs156.example.web;

import static org.mockito.Mockito.lenient;

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
public class ArticlesWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create New Article")).isVisible();
        page.getByTestId("ArticlesForm-title").fill("NYT");
        page.getByTestId("ArticlesForm-url").fill("nyt.com");
        page.getByTestId("ArticlesForm-explanation").fill("This is the New York Times' Homepage!");
        page.getByTestId("ArticlesForm-email").fill("n@nyt.com");
        page.getByTestId("ArticlesForm-localDateTime").fill("2022-01-03T00:00:00");
        page.getByTestId("ArticlesForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title"))
                .hasText("NYT");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-url"))
                .hasText("nyt.com");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation"))
                .hasText("This is the New York Times' Homepage!");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-email"))
                .hasText("n@nyt.com");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-localDateTime"))
                .hasText("2022-01-03T00:00:00");

        page.getByTestId("ArticlesTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Article")).isVisible();
        page.getByTestId("ArticlesForm-title").fill("CNN");
        page.getByTestId("ArticlesForm-url").fill("cnn.com");
        page.getByTestId("ArticlesForm-explanation").fill("This is CNN's Homepage!");
        page.getByTestId("ArticlesForm-email").fill("c@cnn.com");
        page.getByTestId("ArticlesForm-localDateTime").fill("2022-04-03T00:00:00");
        page.getByTestId("ArticlesForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title"))
                .hasText("CNN");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-url"))
                .hasText("cnn.com");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation"))
                .hasText("This is CNN's Homepage!");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-email"))
                .hasText("c@cnn.com");
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-localDateTime"))
                .hasText("2022-04-03T00:00:00");
        
        page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_restaurant() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-name")).not().isVisible();
    }
}