FROM gitpod/workspace-full
USER gitpod

RUN git clone https://github.com/grain-lang/grain.git && \
    cd grain && \
    yarn && \
    yarn compiler build 

