package com.rp.expenseapi.security;

import com.rp.expenseapi.dto.auth.AuthenticatedUserDTO;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@Builder
public class JwtResponse {
	private final String token;
	private final AuthenticatedUserDTO authenticatedUser;
}
