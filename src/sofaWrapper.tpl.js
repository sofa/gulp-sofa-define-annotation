export default function(data) {
    return `if (sofa) {
    sofa.define('sofa.${data.name}', function(${data.args}) {
        return new ${data.name}(${data.args});
    });
}
`;
};
