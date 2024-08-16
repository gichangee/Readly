package com.ssafy.readly.interceptor;

import com.ssafy.readly.service.member.MemberService;
import com.ssafy.readly.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Component
public class JwtInterceptor implements HandlerInterceptor {

    private final JWTUtil jwtUtil;
    private final MemberService memberService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setContentType("application/json; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        if(request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String accessToken = request.getHeader("Authorization");
        if(accessToken != null && jwtUtil.checkToken(accessToken)) {
            Integer memberId = jwtUtil.getMemberId(accessToken);
      
            if(accessToken.equals(memberService.getAccessToken(memberId))) {
                request.setAttribute("memberId", memberId);
                return true;
            }

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("중복 로그인입니다. 새로운 로그인 요청으로 인해 기존 토큰이 무효화되었습니다.");
            return false;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("토큰이 유효하지 않습니다.");
        return false;
    }
}
