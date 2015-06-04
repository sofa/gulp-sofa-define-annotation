if (sofa) {
    sofa.define('sofa.<%= name %>', function(<%= args %>) {
        return new <%= name %>(<%= args %>);
    });
}

