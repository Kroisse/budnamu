# Claude Code가 포함된 개발 환경
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Claude Code 설치 (npm을 통해)
# RUN npm install -g @anthropic-ai/claude-code

# 개발자 계정으로 전환
USER vscode

# 기본 셸을 zsh로 설정하고 path 업데이트
RUN echo 'export PATH="$PATH:/home/vscode/.local/bin"' >> /home/vscode/.zshrc

# 작업 디렉토리 설정
WORKDIR /workspace
