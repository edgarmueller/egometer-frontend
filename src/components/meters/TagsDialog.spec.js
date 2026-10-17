import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import Chip from "@material-ui/core/Chip";
import TagsDialog, { validateTag } from "./TagsDialog";
import { activityIcon, activityLabel } from "../../widgets/day/activities";

configure({ adapter: new Adapter() });

describe("activity tags", () => {
  it("labels built-in tags nicely and shows custom ones as typed", () => {
    expect(activityLabel("movies_tv")).toBe("Movies & TV");
    expect(activityLabel("side_project")).toBe("Side Project");
    expect(activityLabel("Yoga & stretching")).toBe("Yoga & stretching");
  });

  it("finds icons for known tags, ignoring case, with a fallback", () => {
    expect(activityIcon("music")).toBe("md-musical-notes");
    expect(activityIcon("Cooking")).toBe("md-restaurant");
    expect(activityIcon("Board games")).toBe("md-pricetag");
  });

  it("validates new tags", () => {
    expect(validateTag("Yoga", ["work"])).toBeUndefined();
    expect(validateTag("Work", ["work"])).toEqual(expect.any(String));
    expect(validateTag("x".repeat(51), ["work"])).toEqual(expect.any(String));
  });
});

describe("TagsDialog", () => {
  const render = (onSave) =>
    mount(
      <TagsDialog
        open
        meterName="Activities"
        tags={["work", "music"]}
        onSave={onSave}
        onClose={jest.fn()}
      />
    );
  const save = (wrapper) =>
    wrapper
      .find("button")
      .filterWhere((b) => b.text() === "Save")
      .simulate("click");

  it("adds and removes tags", () => {
    const onSave = jest.fn();
    const wrapper = render(onSave);
    wrapper
      .find("input")
      .simulate("change", { target: { value: " Yoga & stretching " } });
    wrapper.find("form").simulate("submit");
    // remove "work"
    wrapper.find(Chip).first().prop("onDelete")();
    wrapper.update();
    save(wrapper);
    expect(onSave).toHaveBeenCalledWith(["music", "Yoga & stretching"]);
  });

  it("keeps at least one tag", () => {
    const wrapper = mount(
      <TagsDialog open tags={["work"]} onSave={jest.fn()} onClose={jest.fn()} />
    );
    expect(wrapper.find(Chip).prop("onDelete")).toBeUndefined();
  });

  it("doesn't add duplicates", () => {
    const onSave = jest.fn();
    const wrapper = render(onSave);
    wrapper.find("input").simulate("change", { target: { value: "Music" } });
    wrapper.find("form").simulate("submit");
    save(wrapper);
    expect(onSave).toHaveBeenCalledWith(["work", "music"]);
  });
});
