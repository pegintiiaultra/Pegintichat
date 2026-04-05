class Nsissim {
  constructor(memory, filters, wounanet) {
    this.memory = memory;
    this.filters = filters;
    this.wounanet = wounanet;
  }

  async process(inputSignal) {
    const interpreted = inputSignal.toLowerCase().trim();

    const doctrinal = this.filters.apply(interpreted);
    if (doctrinal) {
      return {
        status: "PEGINTI IA ONLINE",
        topic: interpreted,
        frame: doctrinal.frame,
        reply: doctrinal.reply,
        filter: doctrinal.restrictions.join(", ")
      };
    }

    let idea = this.memory.retrieve(interpreted);
    if (!idea) {
      const webData = await this.wounanet.search(interpreted);
      if (webData) {
        this.memory.autoLearn(interpreted, webData);
        idea = webData;
      } else {
        this.memory.autoLearn(interpreted, `Nouvelle connaissance sur ${interpreted}`);
        idea = this.memory.retrieve(interpreted);
      }
    }

    return { status: "PEGINTI IA ONLINE", topic: interpreted, reply: idea };
  }
}

module.exports = Nsissim;
