package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestIT {
  @Autowired
  public CurrentUserService currentUserService;

  @Autowired
  public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired
  RecommendationRequestRepository recommendationRequestRepository;

  @Autowired
  public MockMvc mockMvc;

  @Autowired
  public ObjectMapper mapper;

  @MockBean
  UserRepository userRepository;

  @WithMockUser(roles = { "USER" })
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    // arrange
    LocalDateTime ldt1 = LocalDateTime.parse("2024-05-07T00:00:00");
    LocalDateTime ldt2 = LocalDateTime.parse("2025-05-07T00:00:00");

    RecommendationRequest recommendationRequest = RecommendationRequest.builder()
        .id(1)
        .requesterEmail("student@ucsb.edu")
        .professorEmail("professor@ucsb.edu")
        .explanation("explanation")
        .dateRequested(ldt1)
        .dateNeeded(ldt2)
        .done(true)
        .build();

    recommendationRequestRepository.save(recommendationRequest);

    // act
    MvcResult response = mockMvc.perform(get("/api/recommendationrequests?id=1"))
        .andExpect(status().isOk()).andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(recommendationRequest);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = { "ADMIN", "USER" })
  @Test
  public void an_admin_user_can_post_a_new_recommendationRequest() throws Exception {
    // arrange
    LocalDateTime ldt1 = LocalDateTime.parse("2024-05-07T00:00:00");
    LocalDateTime ldt2 = LocalDateTime.parse("2025-05-07T00:00:00");

    RecommendationRequest recommendationRequest = RecommendationRequest.builder()
        .id(1)
        .requesterEmail("student@ucsb.edu")
        .professorEmail("professor@ucsb.edu")
        .explanation("explanation")
        .dateRequested(ldt1)
        .dateNeeded(ldt2)
        .done(true)
        .build();
    // act
    MvcResult response = mockMvc.perform(
        post(
            "/api/recommendationrequests/post?requesterEmail=student@ucsb.edu&professorEmail=professor@ucsb.edu&explanation=explanation&dateRequested=2024-05-07T00:00:00&dateNeeded=2025-05-07T00:00:00&done=true")
            .with(csrf()))
        .andExpect(status().isOk()).andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(recommendationRequest);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }
}