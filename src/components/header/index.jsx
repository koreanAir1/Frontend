import styled from "styled-components";
import { COLORS } from "../../constants";
import { useNavigate } from "react-router-dom";
import CustomText from "../text";

const CustomHeader = () => {
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <Container>
        <Button onClick={() => navigate("/")}>
          <Logo src="/assets/images/logo.svg" alt="logo" />
          <CustomText
            text={"Korean Air"}
            fontFamily={"Korean Air Sans Bold"}
            fontSize={"1.5rem"}
            color={COLORS.BLUE}
          />
        </Button>
      </Container>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  z-index: 1000;
  background-color: ${COLORS.WHITE};
  box-shadow: 0px 2px 10px rgba(162, 162, 162, 0.2);
`;

const Container = styled.div`
  padding: 1rem 2rem;
  box-sizing: border-box;
`;

const Button = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 1.5rem;
  width: auto;
`;

export default CustomHeader;
