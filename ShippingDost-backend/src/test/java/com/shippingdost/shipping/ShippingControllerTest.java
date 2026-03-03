package com.shippingdost.shipping;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

// Static imports for checking API
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class ShippingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser // This will skip the login part for testing
    @DisplayName("Check if calculation API is working")
    void testCalculateEndpoint() throws Exception {
        // Sending dummy data to see if we get result
        String jsonRequest = "{\"customerId\":1, \"sellerId\":1, \"productId\":1, \"deliverySpeed\":\"standard\"}";

        mockMvc.perform(post("/api/v1/shipping-charge/calculate")
                .with(csrf()) // Adding CSRF because otherwise it will give 403 error
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transportMode").exists()); // Result should have transport mode
    }

    @Test
    @WithMockUser
    @DisplayName("Check if sellers list is coming")
    void testGetSellers() throws Exception {
        // Just checking if sellers API gives 200 OK
        mockMvc.perform(get("/api/v1/sellers"))
                .andExpect(status().isOk());
    }
}