type TabProps = { title: string; children?: any };

function Tab({ title, children }: TabProps) {
  if (!children)
    return (
      <p className="font-bold text-slate-500">You need to add some contents</p>
    );

  return <div>{children}</div>;
}

export default Tab;
