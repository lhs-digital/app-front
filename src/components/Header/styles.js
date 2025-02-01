import styled from "styled-components";

export const Container = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #1a202c;
  box-shdow: 0 0 20px 3px;

  > svg {
    position: absolute;
    top: 37px;
    left: 32px;
    color: #fff;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;
